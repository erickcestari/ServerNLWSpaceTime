import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import z from 'zod';

export async function memoriesRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  app.get('/memories', async (request) => {

    const memories = await prisma.memory.findMany({
      where: {
        userId: request.user.sub,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })
    return memories.map(memory => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        except: memory.content.substring(0, 115).concat('...')
      }
    })
  })

  app.get('/memories/:id', async (request, reply) => {
    const paramSchema = z.object({
      id: z.string().uuid()
    })

    const {id} = paramSchema.parse(request)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    if(!memory.isPublic && memory.userId !== request.user.sub){
      return reply.status(401).send()
    }

    return memory;

  })

  app.post('/memories', async (request) => {

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false)
    })
    
    const {content, isPublic, coverUrl} = bodySchema.parse(request.body)
    console.log('foi')
    const memory = await prisma.memory.create({
      data: {
        content,
        isPublic,
        coverUrl,
        userId: request.user.sub,
      }
    })

    return memory

  })

  app.put('/memories/:id', async (request, reply) => {
    const paramSchema = z.object({
      id: z.string().uuid(),
    })

    const bodySchema = z.object({
      coverUrl: z.string(),
      content: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const {id} = paramSchema.parse(request)

    const {coverUrl, content, isPublic} = bodySchema.parse(request)

    let memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      }
    })

    if(memory.userId !== request.user.sub){
      return reply.status(401).send()
    }

    memory = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        coverUrl,
        content,
        isPublic,
      }
    })

    return memory
  })

  app.delete('/memories/:id', async (request, reply) => {
    const paramSchema = z.object({
      id: z.string().uuid(),
    })

    const {id} = paramSchema.parse(request)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      }
    })

    if(memory.userId !== request.user.sub){
      return reply.status(401).send()
    }

    await prisma.memory.delete({
      where:{
        id,
      },
    })
  })


}