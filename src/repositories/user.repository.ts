import { User } from '../models/user.model';

const db: User[] = [
  {
    username: 'mariorossi',
    password: '1234',
    pois: [
      {
        id: 'Osteria San P',
        position: {
          latitude: 45.4654,
          longitude: 9.1854,
        },
        type: 'restaurant',
        rank: 6.7,
      },
    ],
  },
];

class UserRepository {
  async find(): Promise<User[]> {
    return db;
  }

  async save(user: User): Promise<User | undefined> {
    for (let i = 0; i < db.length; i++) {
      if (db[i].username === user.username) {
        return undefined;
      }
    }

    db.push(user);
    return user;
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return db.find((user) => user.username === username);
  }

  async findByUsernameAndPassword(
    username: string,
    password: string
  ): Promise<User | undefined> {
    return db.find(
      (user) => user.username === username && user.password === password
    );
  }
}

export const userRepository = new UserRepository();
