# The Wishing Well
# © JAM Labs 2015

Modified the socket-io chat example.

Every 5 seconds a new wish is requested from the server which is extracted by random from the database and sent down to the client. When the client receives the message it is then displayed.

When a client posts a new message it is sent to the server and stored in the datebase along with location information if granted and a random number generated for the purpose of identification.


