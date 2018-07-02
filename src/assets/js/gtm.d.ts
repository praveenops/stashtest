// Need to clean up global declaration of js function
declare function gtm(gtmEnv: string): void;
declare function dataLayerPush(userId: string, orgName: string, emailId: string): void;
declare function dataLayerPushPageview(url: string): void;
declare function dataLayerPushEvent(event: any, category: any, action: any, label: any, value: any): void;