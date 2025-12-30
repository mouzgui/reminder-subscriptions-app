import React, { useState, memo } from 'react';
import { View } from 'react-native';
import { SvgUri } from 'react-native-svg';

interface SafeSvgUriProps {
    uri: string;
    width: number;
    height: number;
    fallback?: React.ReactNode;
}

/**
 * A wrapper around SvgUri that handles errors gracefully
 * Falls back to a provided component or nothing on error
 */
export const SafeSvgUri = memo(({ uri, width, height, fallback }: SafeSvgUriProps) => {
    const [hasError, setHasError] = useState(false);

    if (hasError) {
        return fallback ? <>{fallback}</> : null;
    }

    return (
        <SvgUri
            uri={uri}
            width={width}
            height={height}
            onError={() => setHasError(true)}
        />
    );
});
