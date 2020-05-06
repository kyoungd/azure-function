module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.method === "POST") {
        try {
            const dataBlock = req.body.value;
            await commitRawData(dataBlock);
            context.res = {
                status: 200, /* Defaults to 200 */
                body: "OK"
            };
        } catch (e) {
            context.res = {
            status: 500 /* Defaults to 200 */,
            body: e.message
            };
        }    
    }
    else 
        context.res = {
            status: 200, /* Defaults to 200 */
            body: "http post only"
        };
}