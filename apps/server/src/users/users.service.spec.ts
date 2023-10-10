import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('findOne', () => {
    it('should return a user when given a valid username', async () => {
      const mockUser = new User();
      mockUser.username = 'testuser';
      mockUser.password = 'testpassword';

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser);

      const result = await service.findOne('testuser');

      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { username: 'testuser' } });
    });

    it('should return undefined when given an invalid username', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(undefined);

      const result = await service.findOne('invaliduser');

      expect(result).toBeUndefined();
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { username: 'invaliduser' } });
    });
  });

  describe('register', () => {
    it('should create a new user with the given username and password', async () => {
      const mockUser = new User();
      mockUser.username = 'testuser';
      mockUser.password = 'testpassword';

      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(mockUser);

      const result = await service.register('testuser', 'testpassword');

      expect(result).toEqual(mockUser);
      expect(userRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        username: 'testuser',
        password: 'testpassword',
      }));
    });
  });
});