const { createServer } = require("@graphql-yoga/node");
const { resolver } = require("graphql-sequelize");
const models = require("./models");

const typeDefs = `
  type Query {
    airplane(id: ID!): Airplane
    airplanes: [Airplane]

    boardingTicket(id: ID!): BoardingTicket
    boardingTickets: [BoardingTicket]

    customer(id: ID!): Customer
    customers: [Customer]

    flightSchedule(id: ID!): FlightSchedule
    flightSchedules: [FlightSchedule]

    receipt(id: ID!): Receipt
    receipts: [Receipt]
  }

  type Mutation {
    upsertAirplane(name: String!, data: AirplaneInput!): Airplane
  }

  input AirplaneInput {
    planeModel: String
    totalSeats: Int
  }

  type Airplane {
    id: ID!
    planeModel: String
    totalSeats: Int
    slug: String

    schedules: [FlightSchedule]
  }

  type BoardingTicket {
    id: ID!
    seat: String

    owner: Customer
  }

  type Customer {
    id: ID!
    name: String
    email: String

    tickets: [BoardingTicket]
  }

  type FlightSchedule {
    id: ID!
    originAirport: String
    destinationAirport: String
    departureTime: String
  }

  type Receipt {
    id: ID!
    receipt: String
  }
`;

const resolvers = {
  Query: {
    airplane: resolver(models.Airplane),
    airplanes: resolver(models.Airplane),
    boardingTicket: resolver(models.BoardingTicket),
    boardingTickets: resolver(models.BoardingTicket),
    customer: resolver(models.Customer),
    customers: resolver(models.Customer),
    flightSchedule: resolver(models.FlightSchedule),
    flightSchedules: resolver(models.FlightSchedule),
    receipt: resolver(models.Receipts),
    receipts: resolver(models.Receipts),
  },

  Mutation: {
    async upsertAirplane(parent, args, ctx, info) {
        const [airplane, created] = await models.Airplane.findOrCreate({
            where: {
                planeModel: args.name
            },
            defaults: (args.data || {}),
        });

        // if we created the record we do not need to update it
        if (created) {
            return airplane;
        }

        if (typeof args.data !== "undefined") {
            await airplane.update(args.data);
        }

        return airplane;
    }
  },

  Airplane: {
    schedules: resolver(models.Airplane.FlightSchedules),
  },
  BoardingTicket: {
    owner: resolver(models.BoardingTicket.Customer),
  },
  Customer: {
      tickets: resolver(models.Customer.BoardingTickets),
  },
};

const server = new createServer({
  schema: {
    typeDefs,
    resolvers,
  }
});

module.exports = { server };
