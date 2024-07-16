import { User } from '@prisma/client'

type CustomContext = {
    user?: User,
    test?: boolean,
}

export {
    CustomContext
}