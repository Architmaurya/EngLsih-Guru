# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in the SDK proguard files.
# See http://developer.android.com/guide/developing/tools/proguard.html

# React Native
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.react.bridge.** { *; }

# Hermes
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# React Native native modules (reflection)
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
    @com.facebook.proguard.annotations.KeepGettersAndSetters *;
}

# Keep native methods
-keepclassmembers class * {
    native <methods>;
}

# Reanimated
-keep class com.swmansion.reanimated.** { *; }

# Don't warn on missing classes (optional deps)
-dontwarn com.facebook.react.**
-dontwarn com.facebook.hermes.**
