import { HttpException } from '../../core/http-exceptions';
import { HttpStatus } from '../../core/http-status';

export class TrackNotFoundException extends HttpException {
  constructor() {
    super(HttpStatus.NOT_FOUND, { message: 'TRACK_NOT_FOUND', success: false });
  }
}
