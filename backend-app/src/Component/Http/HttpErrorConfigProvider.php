<?php

namespace App\Component\Http;

use App\DTO\Http\HttpError;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;

final class HttpErrorConfigProvider
{
    /**
     * @var HttpError[]
     */
    private array $config;

    /**
     * @var DenormalizerInterface
     */
    private DenormalizerInterface $denormalizer;

    /**
     * @param string[]              $config
     * @param DenormalizerInterface $denormalizer
     *
     * @throws ExceptionInterface
     */
    public function __construct(array $config, DenormalizerInterface $denormalizer)
    {
        $this->denormalizer = $denormalizer;
        $this->config = $this->initConfig($config);
    }

    /**
     * @param string $exceptionName
     *
     * @return null|HttpError
     */
    public function getConfigForException(string $exceptionName): ?HttpError
    {
        return $this->config[$exceptionName] ?? null;
    }

    /**
     * @param string[] $rawConfig
     *
     * @return HttpError[]
     * @throws ExceptionInterface
     */
    private function initConfig(array $rawConfig): array
    {
        $config = [];
        foreach ($rawConfig as $name => $item) {
            $config[$name] ??= $this->denormalizer->denormalize($item, HttpError::class);
        }

        return $config;
    }
}
