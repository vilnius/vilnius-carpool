#jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 ../build/android/release-unsigned.apk Carpool
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 ../build/android/project/build/outputs/apk/android-armv7-release-unsigned.apk Carpool
$ANDROID_HOME/build-tools/23.0.0/zipalign 4 ../build/android/project/build/outputs/apk/android-armv7-release-unsigned.apk Carpool-SNAPSHOT.apk
