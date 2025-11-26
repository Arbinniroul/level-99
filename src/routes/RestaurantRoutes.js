import express from "express";
const app=express()

app.get('/restaurants',getAllRestaruants)

export default app;