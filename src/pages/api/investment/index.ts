import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../../db/PrismaClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { type, code, name, totalNumber, totalValue } = req.body;

    const investmentAlreadyExists = await prismaClient.investment.findFirst({
      where: {
        code
      }
    })

    if (investmentAlreadyExists) {
      const newInvestment = {
        type: investmentAlreadyExists.type,
        code: investmentAlreadyExists.code,
        name: investmentAlreadyExists.name,
        totalNumber: investmentAlreadyExists.totalNumber + totalNumber,
        totalValue: investmentAlreadyExists.totalValue + totalValue
      }

      const investment = await prismaClient.investment.update({
        where: {
          code
        },
        data: newInvestment
      })

      return res.status(201).json(investment)
    }

    const investment = await prismaClient.investment.create({
      data: {
        type,
        code,
        name,
        totalNumber,
        totalValue,
      },
    });

    return res.status(201).json(investment)
  } else if (req.method === 'GET') {
    const investments = await prismaClient.investment.findMany()

    return res.status(200).json(investments)
  }
}
