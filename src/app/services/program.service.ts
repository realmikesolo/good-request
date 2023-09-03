import ProgramModel from '../models/program.model';
import { ProgramRepository } from '../repositories/program.repository';
import { ListProgramDto } from '../routes/program.router';

export class ProgramService {
  constructor(private readonly programRepository: ProgramRepository) {}
  public async list(ctx: ListProgramDto): Promise<{
    data: ProgramModel[];
    message: string;
  }> {
    const { query } = ctx;

    const programs = await this.programRepository.list(query);

    return {
      data: programs,
      message: 'List of programs',
    };
  }
}
