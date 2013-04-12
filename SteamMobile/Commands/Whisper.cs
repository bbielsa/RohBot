﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SteamMobile.Commands
{
    public class Whisper : Command
    {
        public override string Type { get { return "w"; }  }

        public override string Format { get { return "-]"; } }

        public override void Handle(CommandTarget target, string[] parameters)
        {
            if (target.Account == null || parameters.Length < 2)
                return;

            var receiver = parameters[0].ToLower();
            var message = parameters[1];

            var sessions = Program.Sessions.Values.Where(s => s.Name.ToLower() == receiver).ToList();

            if (sessions.Count == 0)
            {
                target.Send("User does not exist or is offline.");
                return;
            }

            target.Account.Reply = receiver;

            foreach (var session in sessions)
            {
                var account = Accounts.Get(session.Username);
                if (account != null)
                    account.Reply = target.Account.Name;

                Program.SendWhisper(session, target.Account.Name, session.Name, message);
            }

            if (target.IsSession)
                Program.SendWhisper(target.Session, target.Account.Name, sessions[0].Name, message);

            Program.LogMessage(new WhisperLine(Util.GetCurrentUnixTimestamp(), target.Account.Name, sessions[0].Name, message));
        }
    }
}