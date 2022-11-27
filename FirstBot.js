const admin_name = 'Doushabao_233'
const mineflayer = require('mineflayer')
const pathfinder = require('mineflayer-pathfinder')
const inventoryViewer = require('mineflayer-web-inventory')
const bot = mineflayer.createBot({
    username: 'bot',
    port: 3931,
    version: '1.19.2'
})

bot.loadPlugin(pathfinder.pathfinder)
// bot.loadPlugin(pathfinder.inventoryViewer)

inventoryViewer(bot)

bot.on('chat', (username, message) => {
    if (username != admin_name) return
    message = message.split(' ')
    console.log(message)

    botCommand(message)
})


function botCommand(message) {
    // 找到玩家
    const admin_entity = bot.players[admin_name].entity

    // 设定玩家为目标
    // const goal_admin = new pathfinder.goals.GoalFollow(admin_entity, 1)

    switch (message[0]) {
        case 'go':
            switch (message[1]) {
                case 'follow':
                    // 跟随玩家
                    // const follow_player = bot.players[0]
                    const goal_player = new pathfinder.goals.GoalFollow(admin_entity, 1)
                    if (message.length <= 2){
                        bot.chat('你输入的长度不对')
                        break
                    }
                    bot.chat('/me 开始跟随' + message[2] + '...')
                    bot.pathfinder.setGoal(goal_player, true)
                    break;
                case 'stop':
                    // 停止移动
                    bot.chat('/me 停下来了')
                    bot.pathfinder.stop()
                    break
                case 'block':
                    // 移动到指定方块
                    if (message.length <= 4) {
                        bot.chat('你输入的长度不对')
                        return
                    }
                    bot.chat('/me 正在往' + message[2] + ' ' + message[3] + ' ' + message[4] + '前进...')
                    x = parseInt(message[2])
                    y = parseInt(message[3])
                    z = parseInt(message[4])
                    const goal_block = new pathfinder.goals.GoalBlock(x, y, z)
                    try {
                        bot.pathfinder.setGoal(goal_block)
                    } catch(e) {
                        console.log(e[0])
                        bot.chat('报错了，去控制台看看')
                        return
                    }
                    break
                case 'attack':
                    bot.chat('/me 打了一下周围的实体')
                    entity = bot.nearestEntity()
                    if (entity) {
                        bot.attack(entity, true)
                    } else {
                        bot.chat('/me 没找到周围的实体')
                    }
                    break
                default:
                    bot.pathfinder.setGoal(goal_admin, false)
            }
            break
        case 'help':
            bot.chat('---------------------------------')
            bot.chat('本服务器使用版本号为：' + bot.version)
            bot.chat('我支持的命令有：')
            bot.chat('go命令：')
            bot.chat(' - go follow （跟随玩家）')
            bot.chat(' - go stop （停止移动）')
            bot.chat(' - go block <x> <y> <z> （移动到坐标）')
            bot.chat(' - go attack （攻击）')
            bot.chat('---------------------------------')
            break
        // default:
            // return
    }
}