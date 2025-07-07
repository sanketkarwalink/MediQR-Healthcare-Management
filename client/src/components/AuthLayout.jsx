import Card from "./Card";
import CardContent from "./CardContent";

const AuthLayout = ({ children, title, subtitle, maxWidth = "md" }) => {
    return (
        <div className="min-h-screen flex justify-center items-center p-6">
            <div className="w-full max-w-md">
                <Card className="shadow-xl border-0 ">
                    <CardContent className="p-8">
                        {(title || subtitle) && (
                            <div className="text-center mb-8">
                                {title && (
                                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
                                )}
                                {subtitle && (
                                    <p className="text-gray-600 text-md">{subtitle}</p>
                                )}
                            </div>
                        )}
                        {children}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AuthLayout;
