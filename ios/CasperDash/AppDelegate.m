#import "AppDelegate.h"
#import "RNSplashScreen.h"
#import "Orientation.h"

#if RCT_DEV
 #import <React/RCTDevLoadingView.h>
#endif

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTLinkingManager.h>
#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>
#import "Orientation.h"
#import "RNSplashScreen.h"

#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>



static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif
@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{

#ifdef FB_SONARKIT_ENABLED
  InitializeFlipper(application);
#endif


  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
#if RCT_DEV
  [bridge moduleForClass:[RCTDevLoadingView class]];
#endif
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"CasperDash"
                                            initialProperties:nil];

  if (@available(iOS 13.0, *)) {
      rootView.backgroundColor = [UIColor systemBackgroundColor];
  } else {
      rootView.backgroundColor = [UIColor whiteColor];
  }

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  //TODO: enable if using notification
  // Define UNUserNotificationCenter
//   UNUserNotificationCenter *center =
//  [UNUserNotificationCenter currentNotificationCenter];
//  center.delegate = self;

  //this code clear stored information in keychain when using react-native-sensitive-info (uninstall app and reinstall, stored information remained)
  if ([[NSUserDefaults standardUserDefaults] boolForKey:@"HAS_RUN_BEFORE"] == NO) {
    [[NSUserDefaults standardUserDefaults] setBool:YES forKey:@"HAS_RUN_BEFORE"];
    NSArray *secItemClasses = [NSArray arrayWithObjects:
                               (__bridge id)kSecClassGenericPassword,
                               (__bridge id)kSecClassInternetPassword,
                               (__bridge id)kSecClassCertificate,
                               (__bridge id)kSecClassKey,
                               (__bridge id)kSecClassIdentity,
                               nil];
    for (id secItemClass in secItemClasses) {
      NSDictionary *spec = @{(__bridge id)kSecClass: secItemClass};
      SecItemDelete((__bridge CFDictionaryRef)spec);
    }
  }

  [RNSplashScreen show];

  return YES;
}

// Called when a notification is delivered to a foreground app.
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       willPresentNotification:(UNNotification *)notification
         withCompletionHandler:
             (void (^)(UNNotificationPresentationOptions options))
                 completionHandler {
  completionHandler(UNNotificationPresentationOptionSound | UNNotificationPresentationOptionBadge |
                    UNNotificationPresentationOptionAlert);
}

- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
  return [Orientation getOrientation];
}

// Required for the register event.
//TODO: enable below code if using notification.
//- (void)application:(UIApplication *)application
//    didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
//  [RNCPushNotificationIOS
//      didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
//}
// Required for the notification event. You must call the completion handler
// after handling the remote notification.
//
//- (void)application:(UIApplication *)application
//    didReceiveRemoteNotification:(NSDictionary *)userInfo
//          fetchCompletionHandler:
//              (void (^)(UIBackgroundFetchResult))completionHandler {
//  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo
//                                fetchCompletionHandler:completionHandler];
//}
//// Required for the registrationError event.
//- (void)application:(UIApplication *)application
//    didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
//  [RNCPushNotificationIOS
//      didFailToRegisterForRemoteNotificationsWithError:error];
//}
//// Required for local notification tapped event
//- (void)userNotificationCenter:(UNUserNotificationCenter *)center
//    didReceiveNotificationResponse:(UNNotificationResponse *)response
//             withCompletionHandler:(void (^)(void))completionHandler {
//  [RNCPushNotificationIOS didReceiveNotificationResponse:response];
//  completionHandler();
//}


- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
 return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];

#endif
}

- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  if ([RCTLinkingManager application:application openURL:url options:options]) {
    return YES;
  }
  return NO;
}

@end
