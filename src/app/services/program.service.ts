import ProgramModel from '../models/program.model';
import { ProgramRepository } from '../repositories/program.repository';
import { ListProgramDto } from '../routes/program.router';

export class ProgramService {
  constructor(private readonly programRepository: ProgramRepository) {}

  public async list(ctx: ListProgramDto): Promise<ProgramModel[]> {
    const { query } = ctx;

    return this.programRepository.list(query);
  }
}
