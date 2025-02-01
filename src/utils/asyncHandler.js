const asyncHandler = (requestHandler) => {
    return (req , res , next) => {
        Promise.resolve(requestHandler(req , res , next)).catch((err) => next(err))
    }  
 }
 export { asyncHandler }

// const asyncHandler = () => {}
// const asyncHandler = (func) => async() => {}rt {a


// const asyncHandler = (fn) => async () => {
//     try {
//         await fn(req , res, next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             Message: error.Message
//         })
//     }
// }