import { MapPin, Calendar, Mail, Link as LinkIcon } from 'lucide-react';

export default function ProfileInfo() {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">About</h2>

            <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                    Passionate event enthusiast and community builder. I love attending tech conferences and music festivals. Always looking for the next great experience!
                </p>

                <div className="flex flex-col space-y-3 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>San Francisco, CA</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>username@example.com</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4" />
                        <a href="#" className="text-blue-600 hover:underline">username.dev</a>
                    </div>

                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Joined March 2024</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
