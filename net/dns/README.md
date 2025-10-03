# DNS - domain name server

- world wide there are 13 root servers
- root server route them to respective TLD dn server
- from TLD server it goes to server who handler(AuthNameServer) it like google-domains, godaddy, porkbun, spaceship, ect..

### Records

- `A` : ip of server
- `CNAME` : maps to other other domain `A` record. it's like linking
- `NS` : it specifies the authority to handle the dns lookup.

# code

- not complete code not completed the implementation because of dig not able to install in the win 11. to test the incomming message.
  if future i will do it
