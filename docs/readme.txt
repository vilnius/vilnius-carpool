Database export

C:\User\Servers\localhost\mongodb-win32-i386-2.2.1\bin\
mongoexport.exe -u spastai -p 123 -h localhost:3002 -d meteor -c city_streets --jsonArray -o city_streets.ajson

mongoimport -u tmh -p <pwd> -h localhost -d tmh -c streets streets.json

mongoimport -u tmh -p <pwd> -h localhost:3002 -d meteor -c streets streets.json

db.trips.ensureIndex({fromLoc: '2d'});
db.trips.ensureIndex({toLoc: '2d'});

Check projectricochet.com/blog/meteor-js-performance

Current version 0.1.4
===============

Design changes
Testing and assure all functionality described in usecases is working



0.0.4 - tdd version

History
=======

0.0.3 - version with old router


Pastabos:
MVP

1. Pirmas langas su aprasymu  aiskiai ka sitas puslapis daro ir prisijungti
2. Padaryti aiskia vartotoju registracija: pradiniam puslapyje "Prisijungti" / "Join"
3. Panaikitni nenaudingus elementus: rodyklytes

Nenaudojami elementati turi buti panaikinti, nes atrodo kad sistema neveikia
4. Paspaudus ant adreso po apacia arba sone rodyti adresus
5. Kai nera nei vienos keliones uzrasyti "Siuo metu jus neturite keliones, galite ja sukurti -cia-"
paspaudus


6. Nerodytu senu kelioniu - sudeti Ateities keliones
7. Datas rodyti teisingas
8. Pirmiausiai rodyti zmones kurie gali pavezti
9. Padaryti taba kelioniu paieksai Keleivis iveda is kur vaziuoja / kur vaziuoja ir jam parodo


[client log] Copy to TripCapsule:Trip(undefined->1b97ad7c22b2b60a8b5c362c) null null null,null null-toAddress:null null null,null null Sun Mar 02 2014 07:50:39 GMT+0200 (EET)-undefined {"_id":"7zsTsDpeGEc5wpzHs","fromLoc":[54.67704,25.25405],"toLoc":[54.6983,25.26558],"owner":"4gsRXBzh6hjiSre7y","time":"2014-03-02T05:50:39.482Z","role":"driver"}
[client log] Copy _id=7zsTsDpeGEc5wpzHs
[client log] Copy fromLoc=54.67704,25.25405
[client log] Copy toLoc=54.6983,25.26558
[client log] Copy owner=4gsRXBzh6hjiSre7y
[client log] Copy time=Sun Mar 02 2014 07:50:39 GMT+0200 (EET)
[client log] Copy role=driver
[client log] Result of TripCapsule:Trip(7zsTsDpeGEc5wpzHs->1b97ad7c22b2b60a8b5c362c) null null null,null (25.25405, 54.677040000000034)-toAddress:null null null,null (25.26558, 54.69830000000002) Sun Mar 02 2014 07:50:39 GMT+0200 (EET)-undefined

[client log] Copy to TripCapsule:Trip(undefined->4c7c3b8106d6cbee67bbb92b) null null null,null null-toAddress:null null null,null null Sun Mar 02 2014 07:50:39 GMT+0200 (EET)-undefined {"_id":"7zsTsDpeGEc5wpzHs","fromLoc":[54.67704,25.25405],"toLoc":[54.6983,25.26558],"owner":"4gsRXBzh6hjiSre7y","time":"2014-03-02T05:50:39.482Z","role":"driver"}
[client log] Copy _id=7zsTsDpeGEc5wpzHs
[client log] Copy fromLoc=54.67704,25.25405
[client log] Copy toLoc=54.6983,25.26558
[client log] Copy owner=4gsRXBzh6hjiSre7y
[client log] Copy time=Sun Mar 02 2014 07:50:39 GMT+0200 (EET)
[client log] Copy role=driver
[client log] Result of TripCapsule:Trip(7zsTsDpeGEc5wpzHs->4c7c3b8106d6cbee67bbb92b) null null null,null null-toAddress:null null null,null null Sun Mar 02 2014 07:50:39 GMT+0200 (EET)-undefined
[
