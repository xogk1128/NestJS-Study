import { Injectable } from '@nestjs/common';
import { Board, BoardStatus } from './boards.model';
import { v1 as uuid } from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardsService {
  private boards: Board[] = [];

  getAllBoards(): Board[] {
    return this.boards;
  }

  createBoard(createBoardDto: CreateBoardDto): Board {
    const { title, description } = createBoardDto;

    const board: Board = {
      id: uuid(),
      title: title,
      description: description,
      status: BoardStatus.PUBLIC,
    };

    this.boards.push(board);
    return board;
  }

  getBoardById(id: String): Board {
    return this.boards.find((board) => board.id === id);
  }

  deleteBoard(id: String): void {
    this.boards.filter((board) => board.id !== id);
  }

  updateBoardStatus(id: String, status: BoardStatus): Board {
    const board = this.getBoardById(id);
    board.status = status;
    return board;
  }
}
