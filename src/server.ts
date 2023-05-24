import fastify from 'fastify'
import { memoriesRoutes } from './routes/memories'
import cors from '@fastify/cors'
import 'dotenv/config'
import { authRoutes } from './routes/auth'
import jwt from '@fastify/jwt'

const app = fastify()

app.register(cors, {
  origin: ['http://localhost:3000'],
})

app.register(jwt, {
  secret: '120i3901kdj921j0d91kj9j1d90j921jkdskd'
})

app.register(memoriesRoutes)
app.register(authRoutes)
app
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('🤖 HTTP server running on http://localhost:3333')
  })
