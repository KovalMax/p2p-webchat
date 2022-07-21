<?php

namespace App\Traits;

use Psr\Log\LoggerInterface;

trait PsrLoggerTrait
{
    /**
     * @var LoggerInterface
     */
    private LoggerInterface $logger;

    /**
     * @required
     *
     * @param LoggerInterface $logger
     *
     * @return void
     */
    public function setLogger(LoggerInterface $logger): void
    {
        $this->logger = $logger;
    }

    /**
     * @param string     $errorMessage
     * @param \Throwable $exception
     * @param array      $errorContext
     */
    protected function logError(string $errorMessage, \Throwable $exception, array $errorContext = []): void
    {
        $errorContext = array_merge(
            [
                'exception' => get_class($exception),
                'exceptionMessage' => $exception->getMessage(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
                'trace' => $exception->getTraceAsString(),
            ],
            $errorContext
        );

        $this->logger->error($errorMessage, $errorContext);
    }

    /**
     * @param string $infoMessage
     * @param array  $infoContext
     *
     * @return void
     */
    protected function logInfo(string $infoMessage, array $infoContext = []): void
    {
        $this->logger->info($infoMessage, $infoContext);
    }

    /**
     * @param string $debugMessage
     * @param array  $debugContext
     */
    protected function logDebug(string $debugMessage, array $debugContext = []): void
    {
        $this->logger->debug($debugMessage, $debugContext);
    }
}
