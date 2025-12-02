import { MapPin, Calendar, Mail, Link as LinkIcon } from 'lucide-react';

export default function ProfileInfo() {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">About</h2>

            <div className="space-y-4">
                <p className="text-gray-600">
                    Passionate event enthusiast and community builder. I love attending tech conferences and music festivals. Always looking for the next great experience!
                </p>

                <div className="flex flex-col space-y-3 text-sm text-gray-500">
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
