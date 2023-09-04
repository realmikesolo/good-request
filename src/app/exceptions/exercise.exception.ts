import { HttpException } from '../../core/http-exceptions';
import { HttpStatus } from '../../core/http-status';

export class ExerciseNotFoundException extends HttpException {
  constructor() {
    super(HttpStatus.NOT_FOUND, { message: 'EXERCISE_NOT_FOUND', success: false });
  }
}

export class ExerciseWithSuchNameAlreadyExistsException extends HttpException {
  constructor() {
    super(HttpStatus.CONFLICT, { message: 'EXERCISE_WITH_SUCH_NAME_ALREADY_EXISTS', success: false });
  }
}
