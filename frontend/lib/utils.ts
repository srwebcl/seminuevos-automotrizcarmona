export function formatEngine(motor: string | undefined | null): string | null {
    if (!motor) return null;

    // Remove non-numeric characters except dot/comma
    const cleanMotor = motor.toString().replace(/[^0-9.,]/g, '');

    // If it's empty after cleaning, return original
    if (!cleanMotor) return motor;

    const num = parseFloat(cleanMotor.replace(',', '.'));

    if (isNaN(num)) return motor;

    // Logic: If >= 100, assume cc and divide by 1000. 
    // Example: 1200 -> 1.2, 1500 -> 1.5, 2000 -> 2.0
    if (num >= 100) {
        return (num / 1000).toFixed(1);
    }

    // If it's already small (e.g. 1.2, 2.0), return as is (formatted to 1 decimal if needed or keep original)
    // The user wants "1.2", so let's standardise to 1 decimal place even if input is '1.2'
    return num.toFixed(1);
}
