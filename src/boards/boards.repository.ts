// import { EntityRepository, Repository } from 'typeorm';
// import { Board } from './board.entity';

// @EntityRepository(Board)
// export class BoardRepository extends Repository<Board> {}

import { Board } from './boards.entity';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatus } from './boards-status.enum';

@Injectable()
export class BoardRepository extends Repository<Board> {
  constructor(dataSource: DataSource) {
    super(Board, dataSource.createEntityManager());
  }

  async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    const { title, description } = createBoardDto;

    const board = new Board();
    board.title = title;
    board.description = description;
    board.status = BoardStatus.PUBLIC;
    await this.save(board);

    return board;
  }

  async getBoardById(id: number): Promise<Board> {
    return await this.findOneBy({ id: id });
  }

  async deleteBoard(id: number): Promise<DeleteResult> {
    return await this.delete(id);
  }
}
