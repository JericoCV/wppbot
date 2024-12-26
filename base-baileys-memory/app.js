const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const { delay } = require('@whiskeysockets/baileys')
const express = require('express')
const path = require("path")
const fs =  require("fs")
const app = express()
app.use('/assets', express.static(path.join(__dirname, 'assets')))

const menuPath = path.join(__dirname, "messages", "menu.txt")
const menu = fs.readFileSync(menuPath, "utf-8")

// Flujos individuales para cada opción
const flow1 = addKeyword(["1"]).addAnswer(
    ['El procedimiento es el siguiente:'],
    ).addAnswer(
        ['2 Pasos para obtener tu constancia de originalidad:'], // Imagen
        { media: 'https://drive.google.com/uc?export=view&id=1nmN4ZMirGt_7Q0gUdkNIfDzb16JiVC1B' }
    ).addAnswer(
        ['El manual para la constancia de Tu Coach UDH, es el siguiente:']
    ).addAnswer(
        ['https://drive.google.com/uc?export=view&id=1sfrwjWi_YuUujJKT8KJUcrGub5RQpNVH'], // PDF
        { media: true }
    ).addAnswer(
        ['La recepción es al día siguiente de su envío, luego la tesis primero pasa por la revisión de omisión de buenas prácticas; si no hay observaciones pasa a turnitin, caso contrario se le envía a su correo las observaciones para que pueda subsanarlas; lo que se revisa es lo siguiente:']
    ).addAnswer(
        ['https://drive.google.com/uc?export=view&id=1cJpCkGa0dbXfw8Y9GZ-yklkUadypNyTt'], // Otro PDF
        { media: true }
    ).addAnswer(
        ['Para que pueda revisar su tesis antes de enviar, active lo siguiente en su archivo']
    ).addAnswer(
        ['☝️'], // Otra imagen
        { media: 'https://drive.google.com/uc?export=view&id=1KAnFXhjUBAD9lIU9JvaMBkkFKaTUsN9n' }
    )

const flow2 = addKeyword(["2"]).addAnswer(
    ['El manual para la constancia de Tu Coach UDH, es el siguiente:']
).addAnswer(
    ['https://drive.google.com/uc?export=view&id=1sfrwjWi_YuUujJKT8KJUcrGub5RQpNVH'], // PDF
    { media: true }
)

const flow3 = addKeyword(["3"]).addAnswer(
    ["El porcentaje permitido para pregrado es de 25%"]
)

const flow4 = addKeyword(["4"]).addAnswer(
    ["El porcentaje permitido para posgrado es de 20%"]
)

const flow5 = addKeyword(["5"]).addAnswer(
    ['Para eliminar los caracteres ocultos, active lo siguiente en su archivo']
).addAnswer(
    ['☝️'], // Otra imagen
    { media: 'https://drive.google.com/uc?export=view&id=1KAnFXhjUBAD9lIU9JvaMBkkFKaTUsN9n' }
)

const flow6 = addKeyword(["6"]).addAnswer(
    ["El informe final pasa antes de la sustentación, pero si tus jurados te observan en la sustentación deberá pasar nuevamente por el software de similitud"]
)

const flow7 = addKeyword(["7"]).addAnswer(
    ["*Horarios de Atención*\n*Lunes a Viernes*\n*8 am - 1 pm*\n*3 pm - 6 pm*"]
)

const flow8 = addKeyword(["8"]).addAnswer(
    ["El número de repositorio es 952068664"]
)

const flow9 = addKeyword(["9"]).addAnswer(
    ["Luego de obtener la constancia de originalidad emitida por el comité de integridad científica, debe sustentar y posterior a ello debe realizar su proceso con el área de repositorio institucional de la UDH"]
)

const menuFlow = addKeyword(['Menu', 'menu', 'Menú', 'menú']).addAnswer(
    menu,
    { capture: true },
    async (ctx, { gotoFlow, flowDynamic }) => {
        // Lista de opciones válidas
        const validInputs = ["1", "2", "3", "4", "5", "6", "7", "8", "9", 'menu', 'menú'];

        // Función para verificar la respuesta y redirigir
        const validateResponse = async () => {
            // Si el input no es válido, enviar mensaje de error
            if (!validInputs.includes(ctx.body.trim().toLowerCase())) {
                await flowDynamic("Lo siento, no entendí tu respuesta. Por favor, selecciona una opción válida o escribe *menu* para ver las opciones.");
                return;  // Termina la ejecución y espera una nueva respuesta
            }

            // Redirigir al flujo correspondiente según la respuesta válida
            switch (ctx.body.trim().toLowerCase()) {
                case "1": return gotoFlow(flow1);
                case "2": return gotoFlow(flow2);
                case "3": return gotoFlow(flow3);
                case "4": return gotoFlow(flow4);
                case "5": return gotoFlow(flow5);
                case "6": return gotoFlow(flow6);
                case "7": return gotoFlow(flow7);
                case "8": return gotoFlow(flow8);
                case "9": return gotoFlow(flow9);
                case "menu":
                    // Si el usuario escribe "menu", se muestra nuevamente el menú
                    return await flowDynamic(menu);
            }
        };

        // Llamar a la función de validación para verificar el input
        await validateResponse();
    }
)



const flowWelcome = addKeyword(['hola', 'ole', 'alo', 'buenos', 'disculpe', 'buen', 'oiga'])
    .addAnswer(
        "Buen Día, Soy el chatbot del *Soporte Turnitin* de la Universidad de Huánuco.",
        { media: 'https://drive.google.com/uc?export=view&id=1lKcpvfpGCpXFsqnKfyVRs1cZvaWVgHD-', delay: 2000 }
    )
    .addAnswer(
        "Escribe *Menu* para brindarte las opciones que dispongo."
    );


const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowWelcome, menuFlow])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
