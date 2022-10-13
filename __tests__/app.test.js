const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  if (db.end) db.end();
});

describe("1. GET /api/categories", () => {
  test("200: responds with array of category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        expect(body.categories.length).toBe(4);
        expect(body.categories).toEqual([
          {
            slug: "euro game",
            description: "Abstact games that involve little luck",
          },
          {
            slug: "social deduction",
            description: "Players attempt to uncover each other's hidden role",
          },
          { slug: "dexterity", description: "Games involving physical skill" },
          {
            slug: "children's games",
            description: "Games suitable for children",
          },
        ]);
      });
  });
  test("404: responds with correct error status when path not found", () => {
    return request(app)
      .get("/api/pizza")
      .expect(404)
      .then(({ body }) => expect(body.message).toBe("Path does not exist"));
  });
});

describe("2. GET /api/reviews/:review_id", () => {
  test("200: responds with review object containing correct keys and properties - refactor => has comment_count too", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual({
          review_id: 2,
          title: "Jenga",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "Fiddly fun for all the family",
          category: "dexterity",
          created_at: `${new Date(1610964101251)}`,
          votes: 5,
          comment_count: "3",
        });
      });
  });
  test("404: returns an error message when passed correct data type but a review_id that does not exist", () => {
    return request(app)
      .get("/api/reviews/123456789")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Review ID does not exist");
      });
  });
  test("400: returns an error message when passed an invalid data type", () => {
    return request(app)
      .get("/api/reviews/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid datatype found");
      });
  });
});

describe("3. GET /api/users", () => {
  test("200: respond with an array of user objects containing the correct keys and properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4);
        expect(body.users).toEqual([
          {
            username: "mallionaire",
            name: "haz",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          },
          {
            username: "philippaclaire9",
            name: "philippa",
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
          },
          {
            username: "bainesface",
            name: "sarah",
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
          },
          {
            username: "dav3rid",
            name: "dave",
            avatar_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          },
        ]);
      });
  });
  test("404: responds with correct error status when invalid path used", () => {
    return request(app)
      .get("/api/users/test")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Path does not exist");
      });
  });
});

describe("4. PATCH /api/reviews/review_id", () => {
  test("200: respond with review object with votes property correctly incremented", () => {
    const votes = { inc_votes: 10 };
    return request(app)
      .patch("/api/reviews/4")
      .send(votes)
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual({
          review_id: 4,
          title: "Dolor reprehenderit",
          designer: "Gamey McGameface",
          owner: "mallionaire",
          review_img_url:
            "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          review_body:
            "Consequat velit occaecat voluptate do. Dolor pariatur fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat et adipisicing laborum do. Sint sit tempor officia pariatur duis ullamco labore ipsum nisi voluptate nulla eu veniam. Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip. Cillum aliquip quis aute enim anim ex laborum officia. Aliqua magna elit reprehenderit Lorem elit non laboris irure qui aliquip ad proident. Qui enim mollit Lorem labore eiusmod",
          category: "social deduction",
          created_at: "2021-01-22T11:35:50.936Z",
          votes: 17,
        });
      });
  });
  test("200: respond with review object with votes property correctly incremented - going into negatives", () => {
    const votes = { inc_votes: -100 };
    return request(app)
      .patch("/api/reviews/6")
      .send(votes)
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual({
          review_id: 6,
          title: "Occaecat consequat officia in quis commodo.",
          designer: "Ollie Tabooger",
          owner: "mallionaire",
          review_img_url:
            "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          review_body:
            "Fugiat fugiat enim officia laborum quis. Aliquip laboris non nulla nostrud magna exercitation in ullamco aute laborum cillum nisi sint. Culpa excepteur aute cillum minim magna fugiat culpa adipisicing eiusmod laborum ipsum fugiat quis. Mollit consectetur amet sunt ex amet tempor magna consequat dolore cillum adipisicing. Proident est sunt amet ipsum magna proident fugiat deserunt mollit officia magna ea pariatur. Ullamco proident in nostrud pariatur. Minim consequat pariatur id pariatur adipisicing.",
          category: "social deduction",
          created_at: "2020-09-13T14:19:28.077Z",
          votes: -92,
        });
      });
  });
  test("400: returns an error message when passed an invalid data type", () => {
    const votes = { inc_votes: "banana" };
    return request(app)
      .patch("/api/reviews/5")
      .send(votes)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid datatype found");
      });
  });
  test("404: returns an error message when when passed correct data type but a review_id that does not exist", () => {
    const votes = { inc_votes: 10 };
    return request(app)
      .patch("/api/reviews/10000")
      .send(votes)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Review ID does not exist");
      });
  });
});
describe("5. GET /api/reviews", () => {
  test("200: responds with array of review objects with comment count for each review and is sorted by date in desc order when no query attached", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeInstanceOf(Array);
        expect(body.reviews).toHaveLength(13);
        expect(body.reviews).toBeSortedBy("date", {
          descending: true,
          coerce: true,
        });
        body.reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              review_id: expect.any(Number),
              title: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_img_url: expect.any(String),
              review_body: expect.any(String),
              category: expect.any(String),
              create_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("200: endpoint accepts category query, responds with array of reviews relating to category (still ordered)", () => {
    return request(app)
      .get("/api/reviews?category=social_deduction")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeInstanceOf(Array);
        expect(body.reviews).toHaveLength(11);
        expect(body.reviews).toBeSortedBy("date", {
          descending: true,
          coerce: true,
        });
        body.reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              review_id: expect.any(Number),
              title: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_img_url: expect.any(String),
              review_body: expect.any(String),
              category: expect("social deduction"),
              create_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("404: returns an error message when passed a query that does not exist", () => {
    return request(app)
      .get("/api/reviews?random=yes")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Query invalid");
      });
  });
  test("200: returns an empty array when given a category with no matching reviews", () => {
    return request(app)
      .get("/api/reviews?category=banana")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toHaveLength(0);
      });
  });
});
