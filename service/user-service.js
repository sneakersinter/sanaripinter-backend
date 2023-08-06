const API_URL = process.env.API_URL;
const UserModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-error");
const TokenModel = require("../models/token-model");

class UserService {
  async registration(email, password, name, surname) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(
        `Пользователь с почтой ${email} уже существует`
      );
    }
    const hashPassword = await bcrypt.hash(password, 3);

    const user = await UserModel.create({
      name,
      surname,
      email,
      password: hashPassword,
      favouriteProducts: [],
    });

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      throw new ApiError.BadRequest("Неккоректная ссылка активации");
    }
    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest("Пользователь с таким email не найден");
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Неверный пароль");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async updateUser(updates) {
    const user = await UserModel.findOne({ email: updates.email });
    if (updates.password) {
      const isPassEquals = await bcrypt.compare(
        updates.password,
        user.password
      );
      if (!isPassEquals) {
        throw ApiError.BadRequest("Неверный пароль");
      }
    }

    const hashPassword = await bcrypt.hash(
      updates.newPassword || user.password,
      3
    );
    let newUpdates = {};

    for (let update in updates) {
      if (update !== "newPassword") {
        if (update === "password") {
          newUpdates["password"] = hashPassword;
        } else newUpdates[update] = updates[update];
      }
    }

    await UserModel.updateOne({ email: updates.email }, { $set: newUpdates });
    const newUser = await UserModel.findOne({ email: updates.email });
    const userDto = new UserDto(newUser);
    return { user: userDto };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async loginWithEmail(email) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest("Пользователь с таким email не найден");
    }

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async getAllUsers() {
    const users = await UserModel.find();
    return users;
  }

  async getUser(refreshToken) {
    console.log(refreshToken);
    const token = await TokenModel.findOne({ refreshToken });
    console.log(token);
    // const user = await UserModel.findOne({email})
    return token;
  }
}

module.exports = new UserService();
