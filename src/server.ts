import 'dotenv/config'
import Express from 'express'

const app = Express()

app.get('/', (req, res) => {
	res.json({ message: 'Hello world!' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running in http://localhost:${PORT}`))
