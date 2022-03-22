import '../../init'
import Utilisateurs from "../../database/models/utilisateurs";
import {writeFileSync} from "fs";

const main = async () => {
    const utilisateurs = await Utilisateurs.query().where('email', 'v.maubert@code-troopers.com')

    //FIXME credentials ne fonctionne pas
    const kcUsers = utilisateurs.map(u => ({
        "username": u.email,
        "enabled": true,
        "totp": false,
        "emailVerified": true,
        "firstName": u.nom,
        "lastName": u.prenom,
        "email": u.email,
        "credentials": [
        {
            "type": "password",
            "algorithm": "bcrypt",
            "value": u.motDePasse
        }
    ]
    }))

    writeFileSync('keycloak.json', JSON.stringify({ realm: "test", users: kcUsers}, null, 2))

    process.exit(0)
}

main()
