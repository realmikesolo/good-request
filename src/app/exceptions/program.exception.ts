import { HttpException } from '../../core/http-exceptions';
import { HttpStatus } from '../../core/http-status';

export class ProgramNotFoundException extends HttpException {
  constructor() {
    super(HttpStatus.NOT_FOUND, { message: 'PROGRAM_NOT_FOUND', success: false });
  }
}
