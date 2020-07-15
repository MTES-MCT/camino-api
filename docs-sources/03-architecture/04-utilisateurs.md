# Utilisateurs

## Ajouter un utilisateur sur le serveur

```sh
# créé un utilisateur
sudo useradd -m -d /home/my-user -s /bin/bash my-user
sudo mkdir /home/my-user/.ssh

# ajoute un mot de passe
sudo passwd my-user

# ajoute la clé ssh à l'utilisateur et à l'utilisateur git
sudo nano /home/my-user/.ssh/authorized_keys
sudo nano /home/git/.ssh/authorized_keys

# ajoute l'utilisateur aux groupes sudo, users, docker
sudo usermod -a -G sudo my-user
sudo usermod -a -G docker my-user
sudo usermod -a -G users my-user
```
