<?php

namespace App\Listener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Events;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class JwtSubscriber implements EventSubscriberInterface
{
    /**
     * @var int
     */
    private int $tokenLifetime;

    /**
     * @var string
     */
    private string $tokenType;

    /**
     * @param int    $tokenLifetime
     * @param string $tokenType
     */
    public function __construct(int $tokenLifetime, string $tokenType)
    {
        $this->tokenLifetime = $tokenLifetime;
        $this->tokenType = $tokenType;
    }

    /**
     * @inheritDoc
     */
    public static function getSubscribedEvents()
    {
        return [
            Events::AUTHENTICATION_SUCCESS => ['onAuthenticationSuccess', 2],
        ];
    }

    public function onAuthenticationSuccess(AuthenticationSuccessEvent $event): void
    {
        //Following https://tools.ietf.org/html/rfc6750
        $event->setData([
            'access_token' => $event->getData()['token'],
            'token_type' => $this->tokenType,
            'expires_in' => $this->tokenLifetime,
        ]);
    }
}
