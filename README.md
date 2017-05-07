# Announcements:

16 April - I think I have fixed the error where a few invasions don't get updated or deleted by using a lot of promises/async junk.

14 April - This bot will now automatically leave servers which have a bot:non bot ratio greater than or equal to 9:1 (90%+ bots). After some viewing, this should only affect the bot farm servers this is in and not yours. If you have a special case, please let me know. I am doing this because I currently only have 512mb ram to spare.</div>



# About:

This bot automatically posts messages for the game Warframe. It will handle events for the platforms `pc, xb1, ps4`. It can also create and mention roles when an alert or invasion with a certain reward appears. It will only post alerts as they appear. That means when you initially set it up, there will be nothing until one occurrs. Invasions and alerts will be updated over time and will be deleted when they expire.</div>


# Setup:

Setup is simple. Create the channels in your server that you want messages for. The channels just have to be named a certain way: `(platform)_wf_alerts`. For example, if you want pc alerts, you would create the channel `pc_wf_alerts`. If you want xb1 alerts, you create the channel `xb1_wf_alerts`. You may have multiple channels with different names. If there are multiple channels with the same name, the bot will only post to one of them. The bot will automatically detect if the channel exists.

You may also setup roles for the bot to mention. There is a set of predefined rewards that the bot will handle. You can create these roles with the `notifysetup` command. For example, if you want to add roles for pc, you just have to do `,notifysetup pc` command. If you want roles for multiple platforms, pass multiple arguments like this: `,notifysetup pc xb1`.</div>


# Commands:

[argument] = required argument
{argument} = optional argument
Platform is of the types `ps4`, `xb1`, or `pc`. By default if no platform is provided pc will be implied probably.
Role is the name of the role.

| Command | Description | Arguments | Examples |
| --- | --- | --- | --- |
| notifysetup | Adds roles that the bot will mention when related alerts appear. | [platform] {platform, platform...} | notifysetup pc, notifysetup xb1 ps4 |
| notify | View, join, or leave roles that are related to this bot's functions. | [j/l] [role] {role, role...} | notify j kavat, notify l kubrow nitain reactor |
| baro | Gives some information about baro kiteer's status. | {platform} | baro, baro pc, baro xb1 |
| sorties | Gives some information about today's sorties | {platform} | sorties, sorties ps4, sorties xb1 |
| ws | Highly versatile worldstate query command. Please use to figure out how to use it :) | {platform} | ws, ws pc, ws ps4 |
| search | Search datamined files courtesy of VoiD_Glitch. | [file] [term] | search, search mis riven, search drop outcast, search star laome |
| about | A basic about and changelog page. | none | about |
| help | A basic help message. | none | help |


# General Comments:

Feel free to give me any suggestions. I have recently change the bot a lot and have updated the invitation permissions to reflect said change. If there is a large update, I may change add (updated) to the bot's nickname to inform users that there has been an update. Thank you for using my bot!</div>
