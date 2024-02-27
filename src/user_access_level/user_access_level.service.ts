import { Injectable } from '@nestjs/common';
import { CreateUserAccessLevelInput } from './dto/create-user_access_level.input';
import { UpdateUserAccessLevelInput } from './dto/update-user_access_level.input';

@Injectable()
export class UserAccessLevelService {
  create(createUserAccessLevelInput: CreateUserAccessLevelInput) {
    return 'This action adds a new userAccessLevel';
  }

  findAll() {
    return `This action returns all userAccessLevel`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userAccessLevel`;
  }

  update(id: number, updateUserAccessLevelInput: UpdateUserAccessLevelInput) {
    return `This action updates a #${id} userAccessLevel`;
  }

  remove(id: number) {
    return `This action removes a #${id} userAccessLevel`;
  }
}
