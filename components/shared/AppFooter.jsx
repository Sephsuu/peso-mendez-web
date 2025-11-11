export function AppFooter() {
    return (
        <footer className="bg-gray-100 py-6 mt-10">
            <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-3 text-gray-700 text-sm">
                <div className="flex gap-4">
                    <a href="#" className="hover:underline">
                        Privacy Policy
                    </a>
                    <a href="#" className="hover:underline">
                        Terms of Use
                    </a>
                    <a href="#" className="hover:underline">
                        Contact
                    </a>
                </div>

                <p className="text-center md:text-right text-gray-600">
                    © 2025 Mendez PESO Job Portal. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
