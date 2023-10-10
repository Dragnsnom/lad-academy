import { AppDataSource } from "../repository"
import { Test } from "../repository/entities/Test.entity"

const testRepo = AppDataSource.getRepository(Test);

export const find = async (): Promise<Test[]> => {
  return await testRepo.find();
}
