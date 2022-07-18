<?php

namespace App\Listener;

use App\Component\Http\HttpErrorFormatter;
use App\Exception\ConstraintValidationException;
use App\Traits\PsrLoggerTrait;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Throwable;

class KernelSubscriber implements EventSubscriberInterface
{
    use PsrLoggerTrait;

    public function __construct(private readonly HttpErrorFormatter $httpErrorFormatter)
    {
    }

    /**
     * @inheritDoc
     */
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::EXCEPTION => [
                ['onKernelException', -10],
            ],
        ];
    }

    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();
        $this->logException($exception);
        $error = $this->httpErrorFormatter->formatError($exception);
        $event->setResponse(new JsonResponse($error->getError(), $error->getResponseCode()));
    }

    private function logException(Throwable $exception): void
    {
        if ($exception instanceof ConstraintValidationException) {
            return;
        }

        $this->logError('Error thrown during process', $exception);
    }
}
