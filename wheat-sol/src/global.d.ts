declare global {
  interface Window {
    TelegramLoginCallback: (user: any) => void;
  }
}
