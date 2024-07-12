import React from 'react';
import { Card, CardBody } from 'reactstrap';
import CenterPiece from '../CenterPiece';

export interface ILoadingProps {
    dotType?: string;
    children?: React.ReactNode;
}

export const Loading: React.FunctionComponent<ILoadingProps> = ({ children, dotType = 'dot-bricks' }) => {
    return (
        <div className="text-center">
            <div className="stage">
                <div className={dotType} />
            </div>
            {children}
        </div>
    );
};

export interface ILoadingComponentProps {
    card?: boolean;
    dotType?: string;
    children?: React.ReactNode;
}

export const LoadingComponent: React.FunctionComponent<ILoadingComponentProps> = ({ card = true, dotType = 'dot-bricks', children }) => {
    if (card) {
        return (
            <CenterPiece>
            <Card>
                <CardBody>
                    <Loading dotType={dotType}>
                        {children}
                    </Loading>
                </CardBody>
            </Card>
            </CenterPiece>
        );
    }

    return (
        <Loading dotType={dotType}>
            {children}
        </Loading>
    );
};

export default LoadingComponent;
