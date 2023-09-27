import { Test, TestingModule } from "@nestjs/testing";
import { OsrtController } from "./osrt.controller";
import { OsrtService } from "./osrt.service";
import { Subject } from "rxjs";

describe("OsrtController", () => {
  let controller: OsrtController;
  let mockEventSubject: Subject<any>;
  let mockOsrtService: OsrtService;

  beforeEach(async () => {
    mockEventSubject = new Subject<any>();
    mockOsrtService = {} as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OsrtController],
      providers: [
        { provide: OsrtService, useValue: mockOsrtService },
        { provide: "EVENT_SUBJECT", useValue: mockEventSubject },
      ],
    }).compile();

    controller = module.get<OsrtController>(OsrtController);
  });

  it("should only send events with matching jobId", (done) => {
    const jobId = "123";
    const events = [
      { jobId: "123", data: "a" },
      { jobId: "456", data: "b" },
      { jobId: "123", data: "c" },
    ];

    const results = []; // 用来存储从 streamEvents Observable 收到的值
    // 订阅 streamEvents 以确保有对象订阅 mockEventSubject
    controller.streamEvents(jobId).subscribe({
      next: (value) => results.push(value), // 收到值时将其存储到 results 数组中
      complete: () => {
        try {
          // 在 Observable 完成时进行断言
          expect(results).toStrictEqual([
            { data: { jobId: "123", data: "a" } },
            { data: { jobId: "123", data: "c" } },
          ]);
          done(); // 完成测试
        } catch (error) {
          done(error); // 如果有错误，将错误传递给 done
        }
      },
    });

    // 在有对象订阅 mockEventSubject 之后，发出事件
    events.forEach((event) => mockEventSubject.next(event));
    mockEventSubject.complete(); // 完成 mockEventSubject Observable，以触发 streamEvents Observable 的完成
  });
});
