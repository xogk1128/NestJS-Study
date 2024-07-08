// import { EntityRepository, Repository } from 'typeorm';
// import { Board } from './board.entity';

// @EntityRepository(Board)
// export class BoardRepository extends Repository<Board> {}

import { Board } from './boards.entity';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatus } from './boards-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class BoardRepository extends Repository<Board> {
  constructor(dataSource: DataSource) {
    super(Board, dataSource.createEntityManager());
  }

  async getAllBoards(): Promise<Board[]> {
    return await this.find();
  }

  async getAllBoardsByUser(user: User): Promise<Board[]> {
    return await this.createQueryBuilder('board')
      .where('board.userId = :userId', { userId: user.id })
      .getMany();
  }

  async createBoard(
    createBoardDto: CreateBoardDto,
    user: User,
  ): Promise<Board> {
    const { title, description } = createBoardDto;

    const board = this.create({
      title,
      description,
      status: BoardStatus.PUBLIC,
      user,
    });

    await this.save(board);

    return board;
  }

  async getBoardById(id: number): Promise<Board> {
    return await this.findOneBy({ id: id });
  }

  async deleteBoard(id: number, user: User): Promise<DeleteResult> {
    return await this.delete({ id, user });
  }

  async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
    const board = await this.getBoardById(id);
    board.status = status;
    await this.save(board);

    return board;
  }
}
