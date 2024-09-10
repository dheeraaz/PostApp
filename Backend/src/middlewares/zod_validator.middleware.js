import {apiError} from '../utils/index.js'

const validateWithSchema = (schema)=> async (req, res, next)=>{
    try {
        const parseBody = await schema.parseAsync(req.body);
        req.body = parseBody;
        next();
    } catch (error) {
        res.status(400).json(new apiError(401, "Validation Error", error.errors))
    }
}

export {validateWithSchema}