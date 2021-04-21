import {User} from "../../../shared/models/user";
import {LoginDto} from "../dtos/login.dto";

export class SaveUserInStorage{
  constructor(public user: User) {}
  static readonly type = '[Login] Save User In Storage'
}

export class LoadUserFromStorage{
  constructor() {}
  static readonly type = '[Login] Load User From Storage'
}

export class UpdateUser{
  constructor(public user: User) {}
  static readonly type = '[Login] Update logged user'
}

export class Login{
  constructor(public loginDTO: LoginDto, public saveLogin: boolean) {}
  static readonly type = '[Login] User Login'
}

export class Logout{
  constructor() {}
  static readonly type = '[Login] Logout User'
}

export class Register{
  constructor(public loginDTO: LoginDto, public saveLogin: boolean) {}
  static readonly type = '[Login] User Register'
}

export class UpdateLoading{
  constructor(public loading: boolean) {}
  static readonly type = '[Login] Update Loading'
}

export class UpdateLoginLoading{
  constructor(public loading: boolean) {}
  static readonly type = '[Login] Update Login Loading'
}

export class UpdateRegisterLoading{
  constructor(public loading: boolean) {}
  static readonly type = '[Login] Update Register Loading'
}

export class UpdateError{
  constructor(public error: string) {}
  static readonly type = '[Login] Update Login Error'
}

export class UpdateRegisterError{
  constructor(public error: string) {}
  static readonly type = '[Login] Update Register Error'
}
