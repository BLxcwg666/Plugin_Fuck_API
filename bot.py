import logging
from telegram import Update, ParseMode
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters, CallbackContext

# Set your Telegram Bot Token here
BOT_TOKEN = '6555978377:AAEc5lWTfTRIeV-p4VmaZb9dd54UR4NMWZQ'

# Set your Telegram Admin User IDs here (comma-separated)
ADMIN_USER_IDS = [5502448506]

# Set the path to ban.txt
BAN_FILE_PATH = 'ban.txt'

# Enable logging
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

# Command handler to start the bot and show help message
def start(update: Update, context: CallbackContext):
    update.message.reply_text("你好，我是你爹，我现在活着")
    logger.info(f"{update.message.from_user.id} 点了 /start")

# Command handler to show help message
def help_command(update: Update, context: CallbackContext):
    help_text = """
使用指令:
/promote <用户ID>: 添加管理员
/demote <用户ID>: 扬了管理员
/ban <ID>: 添加死人
/unban <ID>: 扬了死人
"""
    update.message.reply_text(help_text, parse_mode=ParseMode.MARKDOWN)
    logger.info(f"{update.message.from_user.id} 点了/help")

# Command handler to add an admin user
def promote(update: Update, context: CallbackContext):
    user_id = int(context.args[0])
    if update.message.from_user.id in ADMIN_USER_IDS:
        ADMIN_USER_IDS.append(user_id)
        update.message.reply_text(f"{user_id} 成了管理")
        logger.info(f"{user_id} 被 {update.message.from_user.id} 添加为管理")
    else:
        update.message.reply_text("你寄吧谁")
        logger.warning(f"{update.message.from_user.id} 试图添加管理，但没权")

# Command handler to remove an admin user
def demote(update: Update, context: CallbackContext):
    user_id = int(context.args[0])
    if update.message.from_user.id in ADMIN_USER_IDS:
        ADMIN_USER_IDS.remove(user_id)
        update.message.reply_text(f"{user_id} 没管理了")
        logger.info(f"{user_id} 被 {update.message.from_user.id} 把管理扬了")
    else:
        update.message.reply_text("你寄吧谁")
        logger.warning(f"{update.message.from_user.id} 试图扬别人管理，但是没权")

# Command handler to add an ID to the ban list
def ban(update: Update, context: CallbackContext):
    ban_id = context.args[0]
    if update.message.from_user.id in ADMIN_USER_IDS:
        with open(BAN_FILE_PATH, 'a') as f:
            f.write(f"\n{ban_id}")
        update.message.reply_text(f"ID {ban_id} 已经被扬了")
        logger.info(f"ID {ban_id} 被 {update.message.from_user.id} 扬了")
    else:
        update.message.reply_text("你寄吧谁")
        logger.warning(f"{update.message.from_user.id} 试图扬了别人，但是没权")

# Command handler to remove an ID from the ban list
def unban(update: Update, context: CallbackContext):
    ban_id = context.args[0]
    if update.message.from_user.id in ADMIN_USER_IDS:
        with open(BAN_FILE_PATH, 'r') as f:
            lines = f.readlines()
        with open(BAN_FILE_PATH, 'w') as f:
            for line in lines:
                if line.strip() != ban_id:
                    f.write(line)
        update.message.reply_text(f"ID {ban_id} 复活了")
        logger.info(f"ID {ban_id} 被 {update.message.from_user.id} 复活了")
    else:
        update.message.reply_text("你寄吧谁")
        logger.warning(f"{update.message.from_user.id} 试图复活别人，但是没权")

# Main function to start the bot
def main():
    updater = Updater(BOT_TOKEN)
    dispatcher = updater.dispatcher

    # Add command handlers
    dispatcher.add_handler(CommandHandler("start", start))
    dispatcher.add_handler(CommandHandler("help", help_command))
    dispatcher.add_handler(CommandHandler("promote", promote, pass_args=True))
    dispatcher.add_handler(CommandHandler("demote", demote, pass_args=True))
    dispatcher.add_handler(CommandHandler("ban", ban, pass_args=True))
    dispatcher.add_handler(CommandHandler("unban", unban, pass_args=True))

    # Start the bot
    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()
