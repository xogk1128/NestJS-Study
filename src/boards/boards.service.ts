import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './boards-status.enum';
import { v1 as uuid } from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardRepository } from './boards.repository';
import { Board } from './boards.entity';
import { DeleteResult } from 'typeorm';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,
  ) {}

  getAllBoards(): Promise<Board[]> {
    return this.boardRepository.getAllBoards();
  }

  //   getAllBoards(): Board[] {
  //     return this.boards;
  //   }

  createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    return this.boardRepository.createBoard(createBoardDto);
  }

  //   createBoard(createBoardDto: CreateBoardDto): Board {
  //     const { title, description } = createBoardDto;
  //     const board: Board = {
  //       id: uuid(),
  //       title: title,
  //       description: description,
  //       status: BoardStatus.PUBLIC,
  //     };
  //     this.boards.push(board);
  //     return board;
  //   }

  getBoardById(id: number): Promise<Board> {
    const found = this.boardRepository.getBoardById(id);
    if (!found) {
      throw new NotFoundException(`Can't find Board with id ${id}`);
    }
    return found;
  }
  //   getBoardById(id: String): Board {
  //     const found = this.boards.find((board) => board.id === id);
  //     if (!found) {
  //       throw new NotFoundException(`Can't find Board with id ${id}`);
  //     }
  //     return found;
  //   }

  async deleteBoard(id: number): Promise<DeleteResult> {
    const reuslt = await this.boardRepository.deleteBoard(id);

    if (reuslt.affected === 0) {
      throw new NotFoundException(`Can't find Board with id ${id}`);
    }

    return reuslt;
  }

  //   deleteBoard(id: String): void {
  //     const found = this.getBoardById(id);
  //     this.boards = this.boards.filter((board) => board.id !== found.id);
  //   }

  updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
    return this.boardRepository.updateBoardStatus(id, status);
  }

  //   updateBoardStatus(id: String, status: BoardStatus): Board {
  //     const board = this.getBoardById(id);
  //     board.status = status;
  //     return board;
  //   }
}
